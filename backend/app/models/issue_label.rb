class IssueLabel < ApplicationRecord
	belongs_to :issue_board
	has_many :issues, dependent: :destroy

	validates :name, presence: true
	validate :name_board_unique?

	private

	def name_board_unique?
		return if id;
		exists = IssueLabel.where(issue_board_id: issue_board_id).exists?(name: name)
		errors.add("already exists a label with that name") if(exists)
	end
end
