class Issue < ApplicationRecord
	belongs_to :issue_label


	validates :issue_id, presence: true, numericality: { only_integer: true, greater_than: 0}
	validates :title, presence: true
	# validates :description, allow_nil: true
	validate :valid_duedate?, :issue_id_unique?

	private

	def valid_duedate?
		return if due_date.nil?
		if ((DateTime.parse(due_date.to_s) rescue ArgumentError) == ArgumentError)
			errors.add(:due_date, 'not valid date_time') 
		elsif ((DateTime.parse(due_date.to_s)) <= DateTime.current)
			errors.add(:due_date, 'needs to be in the furture')
		end
	end

	def issue_id_unique?
		
		return if id
		exists = Issue.joins(issue_label: :issue_board).exists?(issue_id: issue_id)
		errors.add(:issue_id, "needs to be unique for the board") if exists
	end


end
