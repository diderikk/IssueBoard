class IssueLabel < ApplicationRecord
	belongs_to :issue_board
	has_many :issues

	validates :name, :color, presence: true
end
